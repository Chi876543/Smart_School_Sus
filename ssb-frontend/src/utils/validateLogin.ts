export function validateLogin(username: string, password: string) {
  const errors: { username?: string; password?: string } = {};

  if (!username || username.trim() === "") {
    errors.username = "Tên đăng nhập không được để trống";
  }

  if (username && username.length < 3) {
    errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
  }

  if (!password || password.trim() === "") {
    errors.password = "Mật khẩu không được để trống";
  }

  if (password && password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }

  return errors;
}
