import { Bell, Search, UserCircle2 } from 'lucide-react'

function Topbar({ title, subtitle, primaryActionLabel, onPrimaryAction }) {
    return (
        <header className="finvo-topbar">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                    <h2 className="page-title mb-1">{title}</h2>
                    <p className="text-secondary mb-0">{subtitle}</p>
                </div>

                <div className="d-flex align-items-center gap-2 gap-md-3 w-100 w-md-auto">
                    <div className="search-wrap flex-grow-1 flex-md-grow-0">
                        <Search size={16} />
                        <input type="text" placeholder="Search architectural records..." />
                    </div>
                    <button className="icon-btn" type="button" aria-label="Notifications">
                        <Bell size={16} />
                    </button>
                    <button className="icon-btn" type="button" aria-label="Profile">
                        <UserCircle2 size={16} />
                    </button>
                    <button type="button" className="btn btn-primary d-none d-md-inline-flex" onClick={onPrimaryAction}>
                        {primaryActionLabel}
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Topbar
