import Icon from './Icon';

const TABS = [
  { id: 'home',      label: 'Home',      icon: 'home' },
  { id: 'standings', label: 'Standings', icon: 'standings' },
  { id: 'predict',   label: 'Predict',   icon: 'bolt' },
  { id: 'insights',  label: 'Insights',  icon: 'insights' },
];

export default function BottomNav({ activeTab, onTabChange, onPositions }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`bnav-item ${activeTab === tab.id ? 'bnav-item--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="bnav-icon-wrap">
            <Icon name={tab.icon} size={22} className="bnav-icon" />
          </span>
          <span className="bnav-label">{tab.label}</span>
        </button>
      ))}
      {onPositions && (
        <button
          className="bnav-item bnav-positions"
          onClick={onPositions}
          title="My Positions"
        >
          <span className="bnav-icon-wrap">
            <Icon name="target" size={22} className="bnav-icon" />
          </span>
          <span className="bnav-label">Positions</span>
        </button>
      )}
    </nav>
  );
}
