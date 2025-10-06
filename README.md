# Medical Paper Intelligent Review

An AI-powered intelligent review system for medical journal papers, supporting multiple AI models and providing professional paper quality assessment and improvement suggestions.

## ✨ Features

- 🤖 **Multi-AI Model Support** - Support for Qwen Max and Gemini 2.0 Flash with comparative analysis
- 📄 **Multiple Format Support** - Support for PDF, Word (docx/doc), and TXT document uploads
- 🔍 **Comprehensive Assessment** - Multi-dimensional review covering structure, academic quality, methodology, ethics, etc.
- 📊 **Detailed Reports** - Provides issue grading, specific suggestions, and improvement directions
- ⚡ **Instant Feedback** - Quickly identify paper issues to accelerate publication process
- 🔐 **Secure Login** - Built-in login system to protect user data security

## 🎯 Review Dimensions

### Core Assessment Indicators
1. **Structural Compliance** - Title, abstract, introduction, methods, results, discussion, conclusion, references
2. **Academic Quality** - Research design, data analysis, logic, innovation
3. **Methodology** - Scientific rigor of research methods, sample size, statistical methods
4. **Ethical Compliance** - Ethics approval, informed consent, data privacy
5. **Data Integrity** - Data adequacy and conclusion support
6. **Language Quality** - Expression clarity, accuracy of professional terminology
7. **Citation Standards** - Reference format and citation adequacy

### Issue Severity Classification
- 🔴 **Critical** - Must be fixed, otherwise unpublishable
- 🟡 **Major** - Strongly recommended to fix, affects paper quality
- 🔵 **Minor** - Suggested optimization to improve paper quality

## 🚀 Quick Start

### Requirements
- Node.js 16.0+
- npm or yarn

### Installation & Running
```bash
# Clone the project
git clone https://github.com/weilb/academic-editing.git
cd medical-paper-reviewer

# Install dependencies
npm install

# Start development server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to view the application

### Usage Steps

#### 1. Login to System
- Username: `zx`
- Password: `123`

#### 2. Upload Paper
- Click upload area or drag and drop files
- Supported formats: PDF, Word, TXT
- File size limit: 10MB

#### 3. Select AI Model
- **Qwen Max** - Alibaba Cloud Tongyi Qianwen flagship model (Recommended)
- **Gemini 2.0 Flash** - Google's latest generative AI (Requires VPN)
- **Dual Model Comparison** - Use both models simultaneously for comparative results (Requires VPN)

#### 4. Start Review
- Click "Start Review" button
- Wait for AI analysis (usually takes 30-60 seconds)

#### 5. View Report
- Overall score (0-100 points)
- Issue statistics charts
- Detailed issue list with modification suggestions
- Improvement recommendations and best practices

## 🛠️ Tech Stack

### Frontend Technologies
- **Framework**: React 19 + TypeScript
- **UI Library**: Ant Design 5.x
- **Styling**: CSS3 + Medical journal professional design
- **Build Tool**: Create React App

### AI Integration
- **Qwen Max**: Alibaba Cloud Tongyi Qianwen API
- **Gemini**: Google Generative AI
- **Document Parsing**: pdf-parse, mammoth

### Core Features
- Intelligent document parsing
- Multi-model AI analysis
- Issue matching algorithms
- Visual report generation

## 📝 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Code linting
npm run lint
```

## ⚠️ Important Notes

- AI review is for reference only and cannot completely replace human expert review
- Please ensure uploaded papers do not contain sensitive personal information
- Gemini model requires stable international network connection
- Recommend using Qwen model for more stable service

## 🔮 Future Plans

- [ ] Support for more AI models (Claude, GPT, etc.)
- [ ] Export PDF/Word review reports
- [ ] Paper version comparison functionality
- [ ] Multi-language interface support
- [ ] Journal template matching
- [ ] Plagiarism detection integration
- [ ] Batch review functionality
- [ ] Open API interface

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🤝 Contributing

Welcome to submit Issues and Pull Requests to improve the project!

## 📞 Contact

If you have questions or suggestions, please contact us through:
- Submit GitHub Issues
- Email project maintainers

---

**Medical Paper Intelligent Review** - Making academic publishing simpler and more efficient!
