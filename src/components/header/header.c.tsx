export const HeaderC = () => {
  const handleClick = () => {
    console.log('clickOnHeader')
    return undefined;
  }
  return <div id="header" onClick={handleClick()}></div>
}
