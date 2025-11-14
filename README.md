# BC Rental Timeline - GitHub Pages Resources

This repository hosts the JavaScript and CSS resources for the Business Central Rental Gantt Chart extension.

## 🚀 Setup Instructions

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click **"New repository"**
3. Name: `bc-rental-timeline`
4. Visibility: **Public** (required for GitHub Pages)
5. Click **"Create repository"**

### 2. Upload Files

Upload these files to the repository root:
- `rental-gantt.js` - Timeline control logic
- `rental-gantt-startup.js` - Control add-in initialization
- `rental-gantt.css` - Custom styling
- `index.html` - Demo page (optional)
- `README.md` - This file

### 3. Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** (or **master**)
4. Folder: **/ (root)**
5. Click **Save**

GitHub Pages will be available at:
```
https://[your-username].github.io/bc-rental-timeline/
```

### 4. Update BC Extension

Update the Control Add-in file in your BC extension:

```al
controladdin "Rental Gantt Chart"
{
    Scripts =
        'https://unpkg.com/vis-timeline@7.7.3/standalone/umd/vis-timeline-graph2d.min.js',
        'https://[your-username].github.io/bc-rental-timeline/rental-gantt.js';

    StartupScript = 'https://[your-username].github.io/bc-rental-timeline/rental-gantt-startup.js';

    StyleSheets =
        'https://unpkg.com/vis-timeline@7.7.3/styles/vis-timeline-graph2d.min.css',
        'https://[your-username].github.io/bc-rental-timeline/rental-gantt.css';
}
```

Replace `[your-username]` with your actual GitHub username.

## 📦 Files

### rental-gantt.js
Core timeline functionality:
- `LoadData(json)` - Load timeline data from AL
- `SetViewMode(mode)` - Change time scale
- `SetDateRange(start, end)` - Set visible date range
- `Refresh()` - Redraw timeline
- `Clear()` - Clear timeline

### rental-gantt-startup.js
Initialization script:
- Creates container div
- Waits for vis-timeline library
- Notifies AL when ready

### rental-gantt.css
Custom styling:
- Contract status colors (active/future/expired)
- Tooltips
- Scrollbars
- Hover effects

## 🔒 Security

- All resources served over **HTTPS** (required by BC)
- vis-timeline loaded from **unpkg.com CDN** (trusted source)
- No sensitive data in JavaScript files

## 🧪 Testing

Open `index.html` in a browser to test the timeline with sample data.

## 📄 License

MIT License - Use freely in your BC extensions.

## 🔗 Links

- [vis-timeline Documentation](https://visjs.github.io/vis-timeline/)
- [Business Central Control Add-ins](https://learn.microsoft.com/dynamics365/business-central/dev-itpro/developer/devenv-control-addin-object)
- [GitHub Pages Documentation](https://docs.github.com/pages)
