function Header({ name
    
    
    , themeColor }) {
  return (
    <header style={{ color: themeColor }}>
      <h1>{name}'s Portfolio</h1>
      <p>Welcome to my Student Portfolio Website</p>
    </header>
  );
}

export default Header;