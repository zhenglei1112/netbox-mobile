const navItems = [
  ['rooms', '机房'],
  ['contracts', '合同'],
  ['incidents', '故障'],
  ['changes', '割接'],
  ['profile', '我的']
];

export function BottomNav({ activePage }) {
  return (
    <nav className="bottom-nav" aria-label="移动端模块导航">
      {navItems.map(([key, label]) => (
        <a className={key === activePage ? 'active' : ''} href={`/m/${key}`} key={key}>
          <span className="nav-dot" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
