export const regexValidate = (name: string) => {
  const regex = /^[A-Za-z\s-]+$/
  return regex.test(name)
}
