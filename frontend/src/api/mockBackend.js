import initialData from './initialData.json';

const STORAGE_KEY = 'medicore_database_v1';

/**
 * Normalizes user object so role is always a clean string AND provides display helpers.
 */
export function normalizeDbUser(u) {
  if (!u) return null;
  const roleName = typeof u.role === 'object' ? u.role?.name : (u.role || 'patient');
  const roleDisplay = (typeof u.role === 'object' ? u.role?.display_name : null) || u.role_display || (roleName.charAt(0).toUpperCase() + roleName.slice(1));
  return {
    ...u,
    role: roleName,
    role_name: roleName,
    role_display: roleDisplay,
    role_object: typeof u.role === 'object' ? u.role : { name: roleName, display_name: roleDisplay },
  };
}

/**
 * Initializes and retrieves the client-side database from localStorage or fallback JSON.
 */
export function getDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.doctors && parsed.doctors.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored DB, resetting to initialData', e);
  }

  // Clone initial data
  const fresh = JSON.parse(JSON.stringify(initialData));
  saveDb(fresh);
  return fresh;
}

export function saveDb(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('Failed to save DB to localStorage', e);
  }
}

/**
 * Handle incoming mock API request and return Axios-compatible response structure.
 */
export async function handleMockRequest(config) {
  const method = (config.method || 'get').toLowerCase();
  let url = config.url || '';

  // Strip baseURL or leading host/proxy if present
  url = url.replace(/^https?:\/\/[^\/]+/, '');
  if (url.startsWith('/api')) {
    url = url.substring(4);
  }
  if (!url.startsWith('/')) {
    url = '/' + url;
  }

  // Extract query params from URL if present
  let [path, queryString] = url.split('?');
  const params = { ...(config.params || {}) };
  if (queryString) {
    const sp = new URLSearchParams(queryString);
    for (const [k, v] of sp.entries()) {
      if (params[k] === undefined) params[k] = v;
    }
  }

  // Parse body data
  let body = {};
  if (config.data) {
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      body = config.data;
    }
  }

  const db = getDb();

  // Helper response builder
  const res = (data, status = 200) => ({
    data,
    status,
    statusText: status === 200 || status === 201 ? 'OK' : 'Error',
    headers: { 'content-type': 'application/json' },
    config,
  });

  // -------------------------------------------------------------
  // 1. AUTH ROUTES
  // -------------------------------------------------------------
  if (path === '/login' && method === 'post') {
    const { email, password } = body;
    const clean = (email || '').trim().toLowerCase();

    // Map common demo shortcuts
    let targetEmail = clean;
    if (clean === 'admin') targetEmail = 'admin@hospital.com';
    else if (clean === 'doctor') targetEmail = 'doctor.sarah@hospital.com';
    else if (clean === 'nurse') targetEmail = 'nurse@hospital.com';
    else if (clean === 'patient') targetEmail = 'patient@hospital.com';
    else if (clean === 'receptionist') targetEmail = 'receptionist@hospital.com';

    let user = db.users.find((u) => {
      const uEmail = (u.email || '').toLowerCase();
      const uName = (u.name || '').toLowerCase();
      return uEmail === targetEmail || uEmail === clean || uName === clean;
    });

    if (!user) {
      if (clean.includes('admin')) {
        user = db.users.find((u) => (typeof u.role === 'object' ? u.role.name : u.role) === 'admin') || db.users[0];
      } else if (clean.includes('doctor') || clean.includes('sarah')) {
        user = db.users.find((u) => (typeof u.role === 'object' ? u.role.name : u.role) === 'doctor');
      } else if (clean.includes('nurse')) {
        user = db.users.find((u) => (typeof u.role === 'object' ? u.role.name : u.role) === 'nurse');
      } else if (clean.includes('patient') || clean.includes('john')) {
        user = db.users.find((u) => (typeof u.role === 'object' ? u.role.name : u.role) === 'patient');
      }
    }

    if (!user) {
      const err = new Error('Invalid email or password.');
      err.response = res({ message: 'The provided credentials do not match our records.' }, 422);
      throw err;
    }

    const normalizedUser = normalizeDbUser(user);
    const token = 'mock_sanctum_token_' + Math.random().toString(36).substring(2);
    return res({
      message: 'Login successful',
      token,
      user: normalizedUser,
    });
  }

  if (path === '/register' && method === 'post') {
    const newId = Math.max(...db.users.map((u) => u.id), 0) + 1;
    const patientRole = db.roles.find((r) => r.name === 'patient') || { id: 5, name: 'patient', display_name: 'Patient' };
    const newUser = {
      id: newId,
      name: body.name,
      email: body.email,
      phone: body.phone || '+880-1700-000000',
      role_id: patientRole.id,
      role: patientRole,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDb(db);

    const token = 'mock_sanctum_token_' + Math.random().toString(36).substring(2);
    return res({
      message: 'Registration successful',
      token,
      user: normalizeDbUser(newUser),
    }, 201);
  }

  if (path === '/logout' && method === 'post') {
    return res({ message: 'Logged out successfully' });
  }

  if (path === '/user' && method === 'get') {
    let currentUser = null;
    try {
      const rawUser = localStorage.getItem('auth_user');
      if (rawUser) currentUser = JSON.parse(rawUser);
    } catch {}

    if (!currentUser) {
      currentUser = db.users.find((u) => (typeof u.role === 'object' ? u.role.name : u.role) === 'admin') || db.users[0];
    }

    return res({ user: normalizeDbUser(currentUser) });
  }

  // -------------------------------------------------------------
  // 2. DEPARTMENTS
  // -------------------------------------------------------------
  if (path === '/departments' && method === 'get') {
    return res({ data: db.departments });
  }

  // -------------------------------------------------------------
  // 3. DOCTORS & AVAILABILITY
  // -------------------------------------------------------------
  if (path === '/doctors' && method === 'get') {
    let docs = [...db.doctors];

    // Search query
    const search = (params.search || params.q || '').toLowerCase();
    if (search) {
      docs = docs.filter((d) => {
        const name = (d.user?.name || '').toLowerCase();
        const spec = (d.specialization || '').toLowerCase();
        const dept = (d.department?.name || '').toLowerCase();
        return name.includes(search) || spec.includes(search) || dept.includes(search);
      });
    }

    // Disease filter
    if (params.disease) {
      const dis = params.disease.toLowerCase();
      docs = docs.filter((d) =>
        (d.treated_diseases || []).some((item) => item.toLowerCase().includes(dis))
      );
    }

    // Department filter
    if (params.department_id && params.department_id !== 'all') {
      const deptId = parseInt(params.department_id, 10);
      docs = docs.filter((d) => d.department_id === deptId);
    }

    return res({
      data: docs,
      total: docs.length,
      current_page: 1,
      per_page: docs.length,
    });
  }

  const docAvailMatch = path.match(/^\/doctors\/(\d+)\/availability$/);
  if (docAvailMatch && method === 'get') {
    const docId = parseInt(docAvailMatch[1], 10);
    const doc = db.doctors.find((d) => d.id === docId);
    const dateStr = params.date || new Date().toISOString().split('T')[0];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[new Date(dateStr).getDay()];

    const availableDays = doc?.available_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const isWorkingDay = availableDays.includes(dayName);

    // Filter appointments for this doctor on this date
    const docAppts = db.appointments.filter(
      (a) => a.doctor_id === docId && a.appointment_date?.startsWith(dateStr) && a.status !== 'cancelled'
    );

    const bookedMap = {};
    docAppts.forEach((a) => {
      const timeSlot = (a.appointment_time || '').substring(0, 5);
      bookedMap[timeSlot] = {
        id: a.id,
        status: a.status,
        patient_name: a.patient?.user?.name || 'Patient',
        patient_phone: a.patient?.user?.phone || '',
        reason: a.reason,
      };
    });

    const slots = [];
    const fromHour = doc?.available_from ? parseInt(doc.available_from.split(':')[0], 10) : 9;
    const toHour = doc?.available_to ? parseInt(doc.available_to.split(':')[0], 10) : 17;

    for (let h = fromHour; h < toHour; h++) {
      for (const m of ['00', '30']) {
        const timeKey = `${String(h).padStart(2, '0')}:${m}`;
        const isBooked = !!bookedMap[timeKey];
        const hour12 = h % 12 || 12;
        const ampm = h < 12 ? 'AM' : 'PM';
        slots.push({
          time: timeKey,
          label: `${String(hour12).padStart(2, '0')}:${m} ${ampm}`,
          is_booked: isBooked,
          appointment: isBooked ? bookedMap[timeKey] : null,
        });
      }
    }

    return res({
      doctor: {
        id: doc?.id,
        name: doc?.user?.name,
        department: doc?.department?.name,
        specialization: doc?.specialization,
        campus: doc?.campus,
        available_days: availableDays,
        available_from: doc?.available_from || '09:00',
        available_to: doc?.available_to || '17:00',
        consultation_fee: doc?.consultation_fee,
      },
      date: dateStr,
      day_name: dayName,
      is_working_day: isWorkingDay,
      total_slots: slots.length,
      booked_count: Object.keys(bookedMap).length,
      available_count: Math.max(0, slots.length - Object.keys(bookedMap).length),
      slots,
    });
  }

  const docShowMatch = path.match(/^\/doctors\/(\d+)$/);
  if (docShowMatch && method === 'get') {
    const docId = parseInt(docShowMatch[1], 10);
    const doc = db.doctors.find((d) => d.id === docId);
    if (!doc) {
      const err = new Error('Doctor not found');
      err.response = res({ message: 'Doctor not found' }, 404);
      throw err;
    }
    return res({ doctor: doc, data: doc });
  }

  // -------------------------------------------------------------
  // 4. APPOINTMENTS & TRACKING
  // -------------------------------------------------------------
  if (path === '/appointments/track' && method === 'get') {
    const rawQuery = (params.query || '').trim();
    const cleanDigits = rawQuery.replace(/[^0-9]/g, '');

    let appt = null;

    // 1. Search by ID if digits <= 7
    if (cleanDigits && cleanDigits.length <= 7) {
      const targetId = parseInt(cleanDigits, 10);
      appt = db.appointments.find((a) => a.id === targetId);
    }

    // 2. Search by phone
    if (!appt && cleanDigits && cleanDigits.length >= 7) {
      appt = db.appointments
        .filter((a) => {
          const ph = (a.patient?.user?.phone || a.notes || '').replace(/[^0-9]/g, '');
          return ph.includes(cleanDigits);
        })
        .pop(); // Get latest
    }

    if (!appt) {
      const err = new Error('No appointment found');
      err.response = res({
        found: false,
        message: 'No appointment found matching this Reference ID or Phone number.',
      }, 404);
      throw err;
    }

    return res({
      found: true,
      appointment: appt,
    });
  }

  if (path === '/appointments/public-book' && method === 'post') {
    const {
      patient_name,
      patient_phone,
      patient_email,
      doctor_id,
      appointment_date,
      appointment_time,
      reason,
    } = body;

    const docId = parseInt(doctor_id, 10);
    const doctor = db.doctors.find((d) => d.id === docId) || db.doctors[0];

    // Find or create patient
    let patient = db.patients.find(
      (p) => (p.user?.phone || '').replace(/[^0-9]/g, '') === (patient_phone || '').replace(/[^0-9]/g, '')
    );

    if (!patient) {
      const newUserId = Math.max(...db.users.map((u) => u.id), 0) + 1;
      const patientRole = db.roles.find((r) => r.name === 'patient') || { id: 5, name: 'patient', display_name: 'Patient' };
      const newUser = {
        id: newUserId,
        name: patient_name,
        email: patient_email || `patient_${patient_phone.replace(/[^0-9]/g, '')}@medicore.local`,
        phone: patient_phone,
        role_id: patientRole.id,
        role: patientRole,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.users.push(newUser);

      const newPatientId = Math.max(...db.patients.map((p) => p.id), 0) + 1;
      patient = {
        id: newPatientId,
        user_id: newUserId,
        user: newUser,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.patients.push(patient);
    }

    const newApptId = Math.max(...db.appointments.map((a) => a.id), 0) + 1;
    const newAppointment = {
      id: newApptId,
      patient_id: patient.id,
      doctor_id: doctor.id,
      appointment_date: appointment_date || new Date().toISOString().split('T')[0],
      appointment_time: appointment_time || '10:00:00',
      status: 'pending',
      reason: reason || 'Online consultation booking',
      notes: `Patient: ${patient_name} | Contact Phone: ${patient_phone}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      doctor: {
        id: doctor.id,
        user: doctor.user,
        department: doctor.department,
        specialization: doctor.specialization,
      },
      patient: {
        id: patient.id,
        user: patient.user,
      },
    };

    db.appointments.unshift(newAppointment);
    saveDb(db);

    const docName = doctor.user?.name || 'Specialist';
    return res({
      success: true,
      message: `Your appointment request has been submitted successfully! Our hospital admin is verifying Dr. ${docName.replace(/^Dr\.\s*/, '')}'s schedule and will finalize your slot shortly.`,
      appointment: newAppointment,
    }, 201);
  }

  if (path === '/appointments' && method === 'get') {
    let list = [...db.appointments];

    // Read current user to apply role-based scope
    let currentUser = null;
    try {
      const rawUser = localStorage.getItem('auth_user');
      if (rawUser) currentUser = JSON.parse(rawUser);
    } catch {}

    const roleName = typeof currentUser?.role === 'object' ? currentUser?.role?.name : currentUser?.role;

    if (roleName === 'doctor') {
      const doc = db.doctors.find((d) => d.user_id === currentUser.id);
      if (doc) {
        list = list.filter((a) => a.doctor_id === doc.id);
      }
    } else if (roleName === 'patient') {
      const pat = db.patients.find((p) => p.user_id === currentUser.id);
      if (pat) {
        list = list.filter((a) => a.patient_id === pat.id);
      }
    }

    if (params.status && params.status !== 'all') {
      list = list.filter((a) => a.status === params.status);
    }
    return res({ data: list });
  }

  const apptStatusMatch = path.match(/^\/appointments\/(\d+)\/status$/);
  if (apptStatusMatch && (method === 'patch' || method === 'put')) {
    const apptId = parseInt(apptStatusMatch[1], 10);
    const appt = db.appointments.find((a) => a.id === apptId);
    if (appt) {
      appt.status = body.status;
      appt.updated_at = new Date().toISOString();
      saveDb(db);
    }
    return res({
      message: `Appointment status updated to ${body.status}.`,
      appointment: appt,
    });
  }

  const apptUpdateMatch = path.match(/^\/appointments\/(\d+)$/);
  if (apptUpdateMatch && method === 'put') {
    const apptId = parseInt(apptUpdateMatch[1], 10);
    const appt = db.appointments.find((a) => a.id === apptId);
    if (appt) {
      if (body.status) appt.status = body.status;
      if (body.appointment_date) appt.appointment_date = body.appointment_date;
      if (body.appointment_time) appt.appointment_time = body.appointment_time;
      if (body.notes) appt.notes = body.notes;
      if (body.doctor_id) {
        appt.doctor_id = parseInt(body.doctor_id, 10);
        const d = db.doctors.find((doc) => doc.id === appt.doctor_id);
        if (d) {
          appt.doctor = { id: d.id, user: d.user, department: d.department, specialization: d.specialization };
        }
      }
      appt.updated_at = new Date().toISOString();
      saveDb(db);
    }
    return res({
      message: 'Appointment updated successfully',
      appointment: appt,
    });
  }

  // -------------------------------------------------------------
  // 5. ADMIN DASHBOARD
  // -------------------------------------------------------------
  if (path === '/admin/dashboard' && method === 'get') {
    const today = new Date().toISOString().split('T')[0];
    const totalUsers = db.users.length;
    const totalDoctors = db.doctors.length;
    const totalPatients = db.patients.length;
    const totalAppointments = db.appointments.length;
    const pendingAppointments = db.appointments.filter((a) => a.status === 'pending').length;
    const todayAppointments = db.appointments.filter((a) => a.appointment_date?.startsWith(today)).length;

    const recentAppointments = db.appointments.slice(0, 10);
    const recentPatients = db.patients.slice(0, 5);

    return res({
      stats: {
        total_users: totalUsers,
        total_doctors: totalDoctors,
        total_patients: totalPatients,
        total_appointments: totalAppointments,
        pending_appointments: pendingAppointments,
        today_appointments: todayAppointments,
      },
      recent_appointments: recentAppointments,
      recent_patients: recentPatients,
    });
  }

  // -------------------------------------------------------------
  // 6. SALARIES & PAYROLL
  // -------------------------------------------------------------
  if (path === '/admin/salaries' && method === 'get') {
    const month = params.month || '2026-10';
    let records = db.salaries.filter((s) => s.month === month);

    // If no records exist for this month yet, clone records from another month
    if (records.length === 0 && db.salaries.length > 0) {
      const templateMonth = db.salaries[0].month;
      const templates = db.salaries.filter((s) => s.month === templateMonth);
      let nextId = Math.max(...db.salaries.map((s) => s.id), 0) + 1;
      templates.forEach((t) => {
        const cloned = {
          ...t,
          id: nextId++,
          month: month,
          status: 'pending',
          paid_at: null,
          transaction_ref: null,
        };
        db.salaries.push(cloned);
      });
      saveDb(db);
      records = db.salaries.filter((s) => s.month === month);
    }

    if (params.status && params.status !== 'all') {
      records = records.filter((s) => s.status === params.status);
    }
    if (params.role && params.role !== 'all') {
      records = records.filter((s) => {
        const rName = typeof s.user?.role === 'object' ? s.user?.role?.name : s.user?.role;
        return rName === params.role;
      });
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      records = records.filter((s) => {
        const n = (s.user?.name || '').toLowerCase();
        const e = (s.user?.email || '').toLowerCase();
        return n.includes(q) || e.includes(q);
      });
    }

    const allMonth = db.salaries.filter((s) => s.month === month);
    const totalPayroll = allMonth.reduce((acc, s) => acc + (parseFloat(s.net_salary) || 0), 0);
    const paidPayroll = allMonth.filter((s) => s.status === 'paid').reduce((acc, s) => acc + (parseFloat(s.net_salary) || 0), 0);
    const pendingPayroll = totalPayroll - paidPayroll;

    const metrics = {
      month,
      total_payroll: totalPayroll,
      paid_payroll: paidPayroll,
      pending_payroll: pendingPayroll,
      total_staff: allMonth.length,
      paid_count: allMonth.filter((s) => s.status === 'paid').length,
      pending_count: allMonth.filter((s) => s.status !== 'paid').length,
    };

    return res({
      status: 'success',
      metrics,
      data: records,
    });
  }

  const salaryPayMatch = path.match(/^\/admin\/salaries\/(\d+)\/pay$/);
  if (salaryPayMatch && method === 'put') {
    const salaryId = parseInt(salaryPayMatch[1], 10);
    const salary = db.salaries.find((s) => s.id === salaryId);
    if (salary) {
      salary.status = 'paid';
      salary.payment_method = body.payment_method || 'Direct Bank Transfer';
      salary.transaction_ref = body.transaction_ref || ('TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase());
      salary.paid_at = new Date().toISOString();
      if (body.notes) salary.notes = body.notes;
      salary.updated_at = new Date().toISOString();
      saveDb(db);
    }
    return res({
      status: 'success',
      message: `Salary of $${salary?.net_salary} disbursed successfully to ${salary?.user?.name}.`,
      data: salary,
    });
  }

  if (path === '/admin/salaries/disburse-all' && method === 'post') {
    const month = body.month || '2026-10';
    let count = 0;
    db.salaries.forEach((s) => {
      if (s.month === month && s.status !== 'paid') {
        s.status = 'paid';
        s.payment_method = body.payment_method || 'Corporate Bank Auto-Disbursal';
        s.transaction_ref = 'TXN-AUTO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        s.paid_at = new Date().toISOString();
        s.updated_at = new Date().toISOString();
        count++;
      }
    });
    saveDb(db);
    return res({
      status: 'success',
      message: `Successfully disbursed salaries for ${count} staff member${count === 1 ? '' : 's'}.`,
    });
  }

  const salaryAdjustMatch = path.match(/^\/admin\/salaries\/(\d+)$/);
  if (salaryAdjustMatch && method === 'put') {
    const salaryId = parseInt(salaryAdjustMatch[1], 10);
    const salary = db.salaries.find((s) => s.id === salaryId);
    if (salary) {
      if (body.base_salary !== undefined) salary.base_salary = parseFloat(body.base_salary);
      if (body.allowances !== undefined) salary.allowances = parseFloat(body.allowances);
      if (body.deductions !== undefined) salary.deductions = parseFloat(body.deductions);
      salary.net_salary = salary.base_salary + salary.allowances - salary.deductions;
      if (body.notes !== undefined) salary.notes = body.notes;
      salary.updated_at = new Date().toISOString();
      saveDb(db);
    }
    return res({
      status: 'success',
      message: 'Salary package updated successfully.',
      data: salary,
    });
  }

  // -------------------------------------------------------------
  // 7. USER MANAGEMENT (CRUD)
  // -------------------------------------------------------------
  if (path === '/admin/users' && method === 'get') {
    let users = [...db.users];
    if (params.role) {
      users = users.filter((u) => {
        const rName = typeof u.role === 'object' ? u.role?.name : u.role;
        return rName === params.role;
      });
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      users = users.filter((u) => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
    }
    return res({
      data: users.map(normalizeDbUser),
      total: users.length,
      current_page: 1,
      last_page: 1,
    });
  }

  if (path === '/admin/users' && method === 'post') {
    const newId = Math.max(...db.users.map((u) => u.id), 0) + 1;
    const roleObj = db.roles.find((r) => r.name === body.role) || { id: 2, name: body.role, display_name: body.role };
    const newUser = {
      id: newId,
      name: body.name,
      email: body.email,
      phone: body.phone || '+880-1700-000000',
      role_id: roleObj.id,
      role: roleObj,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.users.unshift(newUser);

    // If role is doctor, also add doctor profile
    if (body.role === 'doctor') {
      const newDocId = Math.max(...db.doctors.map((d) => d.id), 0) + 1;
      const dept = db.departments.find((d) => d.id === parseInt(body.department_id, 10)) || db.departments[0];
      const newDoctor = {
        id: newDocId,
        user_id: newId,
        department_id: dept?.id || 1,
        specialization: body.specialization || 'General Specialist',
        qualification: body.qualification || 'MBBS, FCPS',
        consultation_fee: body.consultation_fee || '100.00',
        available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        available_from: '09:00:00',
        available_to: '17:00:00',
        experience_years: 5,
        rating: '5.00',
        reviews_count: 10,
        campus: 'Dhaka Main Hospital',
        user: newUser,
        department: dept,
      };
      db.doctors.push(newDoctor);
    }

    saveDb(db);
    return res({ message: 'User created successfully.', user: normalizeDbUser(newUser) }, 201);
  }

  const userActionMatch = path.match(/^\/admin\/users\/(\d+)$/);
  if (userActionMatch && method === 'put') {
    const userId = parseInt(userActionMatch[1], 10);
    const user = db.users.find((u) => u.id === userId);
    if (user) {
      if (body.name) user.name = body.name;
      if (body.email) user.email = body.email;
      if (body.phone) user.phone = body.phone;
      if (body.status) user.status = body.status;
      user.updated_at = new Date().toISOString();
      saveDb(db);
    }
    return res({ message: 'User updated successfully.', user: normalizeDbUser(user) });
  }

  if (userActionMatch && method === 'delete') {
    const userId = parseInt(userActionMatch[1], 10);
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      db.users.splice(idx, 1);
      saveDb(db);
    }
    return res({ message: 'User deleted successfully.' });
  }

  // -------------------------------------------------------------
  // 8. PATIENTS
  // -------------------------------------------------------------
  if (path === '/patients' && method === 'get') {
    let pts = [...db.patients];
    if (params.search) {
      const q = params.search.toLowerCase();
      pts = pts.filter((p) => (p.user?.name || '').toLowerCase().includes(q) || (p.user?.phone || '').includes(q));
    }
    return res({ data: pts });
  }

  // -------------------------------------------------------------
  // DEFAULT / FALLBACK
  // -------------------------------------------------------------
  return res({ message: 'OK', data: [] });
}
