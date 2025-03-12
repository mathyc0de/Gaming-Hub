// TODO Integrates the user page with the backend
// TODO Save cookies
// TODO Bring sent/solicitations/recieved friends
// TODO Bring Users online
// TODO Users profile settings
// TODO Users privacy settings
// TODO Bring user's profile
// ? Maybe bring the login system here

const userManagementPage = document.querySelector('.user-management-page')

userManagementPage.addEventListener('click', () => {
    window.open("http://localhost:5244/index.html", "User Management", "width=800,height=800")
})
