# Personal Data Inventory Tool

A comprehensive web application for managing and tracking personal data across different services and platforms. This tool helps you maintain an inventory of your personal information, understand data sharing practices, and export your data in multiple formats.

## Features

### 📊 Data Management
- **Add/Edit/Delete Entries**: Create detailed records of your personal data
- **Categorization**: Organize data by 10 different categories (Personal ID, Contact Info, Financial, Health, etc.)
- **Sensitive Data Tracking**: Mark and track sensitive data that requires special protection
- **Data Sharing Monitoring**: Track which data is shared with third parties

### 🔍 Search & Filter
- **Real-time Search**: Search through data types, descriptions, and sources
- **Category Filtering**: Filter by specific data categories
- **Sensitive Data Filter**: View only sensitive data entries
- **Shared Data Filter**: View only data shared with third parties

### 📈 Analytics Dashboard
- **Overview Statistics**: Total entries, sensitive data count, shared data count
- **Category Breakdown**: Visual representation of data distribution
- **Recent Activity**: Track new entries added in the last 7 days
- **Data Protection Insights**: Automated recommendations and insights

### 💾 Data Persistence
- **Local Storage**: All data is stored locally in your browser
- **No Server Required**: Complete client-side application
- **Privacy First**: Your data never leaves your device

### 📤 Export Capabilities
- **CSV Export**: Compatible with Excel and Google Sheets
- **Excel Export**: Direct Excel format download
- **PDF Export**: Professional reports with formatted tables
- **Filtered Exports**: Export only specific categories or sensitive data
- **Date Range Filtering**: Export data from specific time periods

## Data Categories

1. **🆔 Personal Identification**: Names, ID numbers, passport details
2. **📞 Contact Information**: Email addresses, phone numbers, addresses
3. **💳 Financial Data**: Bank accounts, credit cards, payment info
4. **🏥 Health Data**: Medical records, health conditions, prescriptions
5. **👤 Biometric Data**: Fingerprints, facial recognition, voice patterns
6. **📍 Location Data**: GPS coordinates, IP addresses, check-ins
7. **🌐 Online Activity**: Browsing history, search queries, social media
8. **⚙️ Preferences**: Settings, interests, marketing preferences
9. **💬 Communication Data**: Messages, emails, call logs, chat history
10. **📋 Other**: Any other personal data not covered above

## Usage

### Adding a New Entry
1. Click the "Add Entry" button
2. Select the appropriate category
3. Fill in the data type and description
4. Specify the source (e.g., Google, Facebook, Bank)
5. Define the purpose and legal basis
6. Set retention period
7. Mark if the data is sensitive or shared
8. Add any additional notes

### Searching and Filtering
- Use the search bar to find specific entries
- Select a category from the dropdown to filter by type
- Check "Sensitive data only" to view only sensitive entries
- Check "Shared data only" to view only shared data

### Exporting Data
1. Click the "Export" button
2. Choose your preferred format (CSV, Excel, or PDF)
3. Optionally include sensitive data
4. Click "Export" to download the file

## Technical Details

### Built With
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **jsPDF**: PDF generation
- **Local Storage**: Client-side data persistence

### File Structure
```
src/
├── types/
│   └── personalDataInventory.ts          # TypeScript interfaces
├── utils/
│   └── personalDataInventory/
│       ├── storage.ts                    # Local storage management
│       ├── export.ts                     # Export functionality
│       └── constants.ts                  # Data categories and options
└── components/
    └── personalDataInventory/
        ├── PersonalDataInventory.tsx     # Main component
        ├── DataEntryForm.tsx             # Add/Edit form
        ├── DataEntryList.tsx             # Data table
        ├── StatsDashboard.tsx            # Analytics dashboard
        ├── SearchAndFilter.tsx           # Search and filtering
        ├── ExportModal.tsx               # Export dialog
        └── index.ts                      # Component exports
```

## Privacy & Security

- **Local Storage Only**: All data is stored in your browser's local storage
- **No External Servers**: No data is sent to external services
- **Client-Side Processing**: All operations happen in your browser
- **Export Control**: You control what data to export and when

## Getting Started

1. Navigate to `/resources/tools/personal-data-inventory` in the application
2. Click "Add Entry" to create your first data entry
3. Use the search and filter options to organize your data
4. Export your data when needed for compliance or analysis

## Use Cases

- **GDPR Compliance**: Track personal data for GDPR compliance
- **Data Subject Requests**: Prepare for data subject access requests
- **Privacy Audits**: Conduct personal privacy audits
- **Data Minimization**: Identify unnecessary data collection
- **Third-Party Tracking**: Monitor data sharing with third parties
- **Retention Management**: Track data retention periods

## Future Enhancements

- Data encryption for sensitive entries
- Backup and restore functionality
- Data visualization charts
- Automated data discovery
- Integration with privacy tools
- Mobile app version

---

**Note**: This tool is designed for personal use and helps you understand and manage your personal data. It does not replace professional legal or compliance advice.
