export default (input: string): boolean => {
  const valid = /(\w+)?[가-힣ㄱ-ㅎa-zA-Z\s^#&<>"~.;$^%{}?]{1,}$/g;
  return valid.test(input);
};
