export const HeaderC = () => {
  const handleClick = () => {
    console.log('clickOnHeader')
  }
  return <div id="header" onClick={handleClick()}></div>
}