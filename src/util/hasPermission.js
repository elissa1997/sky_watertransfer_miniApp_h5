export function hasPermission(who, perList) {
  console.log(who, perList);
  if (who) {
    return perList.indexOf(who) !== -1;
  }else{
    return false;
  }
}