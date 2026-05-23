import { useState } from 'react';

import { Inbox, Bell, ShieldAlert, Moon, Sun, Languages } from 'lucide-react';

import { OWNER_AVATAR_URL, OWNER_DISPLAY_NAME } from '../constants/brand.js';

import HeaderIconDropdown from './HeaderIconDropdown.jsx';

import { useAppPreferences } from '../context/AppPreferencesContext.jsx';



function HeaderThemeLang() {

  const { theme, locale, locales, setTheme, setLocale, t } = useAppPreferences();



  const segBtn = (active) =>

    `p-1.5 rounded-md transition-colors ${

      active

        ? 'bg-indigo-600 text-white shadow-sm'

        : 'text-[var(--app-text-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-text-heading)]'

    }`;



  return (

    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

      <div

        className="flex items-center p-0.5 rounded-lg bg-[var(--app-surface-elevated)] border border-[var(--app-border)]"

        role="group"

        aria-label={t('settings.theme')}

      >

        <button

          type="button"

          onClick={() => setTheme('dark')}

          title={t('header.themeDark')}

          className={segBtn(theme === 'dark')}

        >

          <Moon size={16} strokeWidth={2} />

        </button>

        <button

          type="button"

          onClick={() => setTheme('light')}

          title={t('header.themeLight')}

          className={segBtn(theme === 'light')}

        >

          <Sun size={16} strokeWidth={2} />

        </button>

      </div>



      <div className="relative flex items-center rounded-lg bg-[var(--app-surface-elevated)] border border-[var(--app-border)]">

        <Languages size={14} className="absolute left-2 text-[var(--app-text-muted)] pointer-events-none hidden sm:block" />

        <select

          value={locale}

          onChange={(e) => setLocale(e.target.value)}

          title={t('header.language')}

          aria-label={t('header.language')}

          className="select-theme appearance-none text-xs font-medium pl-2 sm:pl-7 pr-6 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 cursor-pointer min-w-[3.5rem]"

        >

          {locales.map((l) => (
            <option key={l.code} value={l.code}>
              {l.short}
            </option>
          ))}

        </select>

        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)] text-[10px] pointer-events-none">

          ▾

        </span>

      </div>

    </div>

  );

}



export default function AppHeaderActions({

  inboxUnreadCount,

  notificationCount,

  expiryAlertCount,

  inboxItems = [],

  notificationItems = [],

  expiryItems = [],

  onViewAllInbox,

  onViewAllNotifications,

  onViewAllExpiryAlerts,

}) {

  const [avatarOk, setAvatarOk] = useState(true);

  const { t } = useAppPreferences();



  return (

    <div className="flex items-center gap-1.5 sm:gap-2">

      <div className="flex items-center gap-0.5 sm:gap-1 rounded-xl bg-[var(--app-surface-elevated)] border border-[var(--app-border)] px-0.5 sm:px-1">

        <HeaderIconDropdown

          icon={Inbox}

          label={t('header.inbox')}

          badge={inboxUnreadCount}

          accent="indigo"

          items={inboxItems}

          emptyText={t('header.emptyInbox')}

          viewAllLabel={t('header.viewAll')}

          onViewAll={onViewAllInbox}

        />

        <HeaderIconDropdown

          icon={Bell}

          label={t('header.notifications')}

          badge={notificationCount}

          accent="slate"

          items={notificationItems}

          emptyText={t('header.emptyNotifications')}

          viewAllLabel={t('header.viewAll')}

          onViewAll={onViewAllNotifications}

        />

        <HeaderIconDropdown

          icon={ShieldAlert}

          label={t('header.expiryAlerts')}

          badge={expiryAlertCount}

          accent="amber"

          items={expiryItems}

          emptyText={t('header.emptyAlerts')}

          viewAllLabel={t('header.viewAll')}

          onViewAll={onViewAllExpiryAlerts}

        />

      </div>



      <div className="w-px h-8 bg-[var(--app-border)] shrink-0" aria-hidden />



      <HeaderThemeLang />



      <div className="w-px h-8 bg-[var(--app-border)] shrink-0" aria-hidden />



      <div className="flex items-center gap-2 min-w-0">

        {avatarOk ? (

          <img

            src={OWNER_AVATAR_URL}

            alt={OWNER_DISPLAY_NAME}

            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-[var(--app-border)] shrink-0 bg-[var(--app-surface-elevated)]"

            referrerPolicy="no-referrer"

            onError={() => setAvatarOk(false)}

          />

        ) : (

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0 border-2 border-[var(--app-border)]">

            T

          </div>

        )}

        <span className="font-semibold text-[var(--app-text-heading)] text-sm truncate max-w-[88px] sm:max-w-none hidden sm:inline">

          {OWNER_DISPLAY_NAME}

        </span>

      </div>

    </div>

  );

}


