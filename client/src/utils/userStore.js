const DEFAULTS = {
  name:  'Student',
  email: 'student@example.com',
}

export const getUser = () => {
  try {
    const stored = localStorage.getItem('cl_profile')
    return stored ? JSON.parse(stored) : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export const saveUser = (data) => {
  localStorage.setItem('cl_profile', JSON.stringify({ ...getUser(), ...data }))
}