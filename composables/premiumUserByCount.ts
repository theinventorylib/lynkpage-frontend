// checking if the user is_premium and if the count passed as argument is 0
export default function (user: UserInterface, count: number) {
  if (user.is_premium || count > 0) {
    return true;
  } else if (count === 0 || count < 0) {
    return false;
  }
}
