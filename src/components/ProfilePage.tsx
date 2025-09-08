import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Download, 
  User, 
  Lock, 
  Edit2, 
  Save, 
  X, 
  Camera, 
  FileText, 
  Calendar, 
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Shield,
  Bell,
  Mail,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { DiagnosisReport, getUserReports } from '../services/reports';

interface AuthUser {
  name?: string;
  email?: string;
}

interface ProfileForm {
  name: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Update useAuth interface
interface AuthContextType {
  user: AuthUser | null;
  updateUserProfile: (data: { 
    name?: string;
    oldPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
}

const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth() as AuthContextType;
  const [reports, setReports] = useState<DiagnosisReport[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(false);

  const [form, setForm] = useState<ProfileForm>({
    name: user?.name || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getUserReports();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        // TODO: Upload to backend
        setSuccess('Profile picture updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameSubmit = async () => {
    if (!form.name.trim()) {
      setError('Name cannot be empty');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await updateUserProfile({ name: form.name });
      setIsEditingName(false);
      setSuccess('Name updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to update name');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await updateUserProfile({ 
        oldPassword: form.oldPassword,
        newPassword: form.newPassword 
      });
      setIsChangingPassword(false);
      setForm(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
      setSuccess('Password updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (report: DiagnosisReport) => {
    const reportContent = `
Medical Diagnosis Report
======================
Date: ${report.date}
Patient: ${user?.name}

Symptoms:
${report.symptoms.map(s => `- ${s}`).join('\n')}

Primary Diagnosis:
${report.diagnosis}
Confidence Level: ${(report.probability * 100).toFixed(2)}%

Detailed Analysis:
${report.details.predictions.map(p => `
• ${p.disease}
  Confidence: ${p.confidence.toFixed(2)}%
  ${p.description}
`).join('\n')}

Recommendations:
${report.details.recommendations.map(r => `
${r.type}:
${r.advice}
`).join('\n')}

Generated by AI Medical Diagnosis Assistant
This report is for informational purposes only.
Please consult with a healthcare professional for medical advice.
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-report-${report.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const toggleReportExpansion = (reportId: string) => {
    setExpandedReportId(expandedReportId === reportId ? null : reportId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Notification Alerts */}
      {(error || success) && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {error ? (
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          ) : (
            <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{error || success}</span>
          <button 
            onClick={() => { setError(null); setSuccess(null); }}
            className="ml-auto p-1 hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="relative h-28 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-lg">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                        <User className="w-10 h-10 text-blue-500 dark:text-blue-300" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-md">
                    <Camera className="h-4 w-4 text-white" />
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-16 pb-6 px-6 text-center">
              <div className="flex items-center justify-center">
                {isEditingName ? (
                  <div className="flex items-center space-x-2 w-full max-w-xs mx-auto">
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Enter your name"
                      autoFocus
                    />
                    <button
                      onClick={handleNameSubmit}
                      disabled={loading}
                      className="p-2 text-green-500 hover:text-green-600 disabled:opacity-50"
                    >
                      <Save className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      {user?.name}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
              
              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Account
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 font-medium"
              >
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </button>
            </div>

            {/* Password Change Form */}
            {isChangingPassword && (
              <div className="px-6 pb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Change Password</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Current Password"
                        value={form.oldPassword}
                        onChange={(e) => setForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-600 dark:border-gray-500 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={form.newPassword}
                        onChange={(e) => setForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-600 dark:border-gray-500 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-600 dark:border-gray-500 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        onClick={() => {
                          setIsChangingPassword(false);
                          setForm(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
                        }}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePasswordSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium transition-colors"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preferences Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-blue-500" />
              Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationsEnabled}
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Email Updates</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={emailUpdatesEnabled}
                    onChange={() => setEmailUpdatesEnabled(!emailUpdatesEnabled)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Reports */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-blue-500" />
                  Medical Reports
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {reports.length} {reports.length === 1 ? 'report' : 'reports'}
                </div>
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reports yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Your medical diagnosis reports will appear here after you complete a symptom analysis.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {reports.map((report) => (
                  <div key={report.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Activity className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {report.diagnosis}
                            </h3>
                            <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(report.date)}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {(report.probability * 100).toFixed(1)}% confidence
                              </div>
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                {report.symptoms.length} symptoms
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Report Details */}
                        {expandedReportId === report.id && (
                          <div className="mt-4 pl-13 space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Symptoms Reported</h4>
                              <div className="flex flex-wrap gap-2">
                                {report.symptoms.map((symptom, index) => (
                                  <span key={index} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                                    {symptom}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detailed Analysis</h4>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                                {report.details.predictions.slice(0, 3).map((prediction, index) => (
                                  <div key={index} className="flex justify-between items-start">
                                    <div>
                                      <span className="font-medium text-gray-900 dark:text-white">{prediction.disease}</span>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{prediction.description}</p>
                                    </div>
                                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                      {prediction.confidence.toFixed(1)}%
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 pl-2">
                                {report.details.recommendations.slice(0, 3).map((rec, index) => (
                                  <li key={index}>{rec.advice}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <button
                          onClick={() => toggleReportExpansion(report.id)}
                          className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                          {expandedReportId === report.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDownloadReport(report)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors font-medium"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;