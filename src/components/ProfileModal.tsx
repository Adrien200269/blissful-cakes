import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Camera, Eye, EyeOff, User, Phone, MapPin, Lock, CheckCircle } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  full_name: string;
  phone: string;
  location: string;
  avatar_url: string;
}

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    phone: '',
    location: '',
    avatar_url: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && isOpen) {
      fetchProfile();
    }
  }, [user, isOpen]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
      return;
    }

    if (data) {
      setProfile({
        full_name: data.full_name || '',
        phone: data.phone || '',
        location: (data as any).location || '',
        avatar_url: (data as any).avatar_url || ''
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadError) {
      toast({
        title: 'Upload Error',
        description: uploadError.message,
        variant: 'destructive',
      });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));
    setUploading(false);
    
    toast({
      title: 'Photo Updated!',
      description: 'Your profile photo has been updated successfully.',
    });
  };

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: profile.full_name,
        phone: profile.phone,
        location: profile.location,
        avatar_url: profile.avatar_url,
        email: user.email
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    }

    setLoading(false);
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSave = async () => {
    await updateProfile();
    if (newPassword) {
      await updatePassword();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-pink-50 to-purple-50 border-0 shadow-2xl">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Profile Settings
          </DialogTitle>
          <p className="text-gray-600 mt-2">Update your personal information and preferences</p>
        </DialogHeader>
        
        <div className="space-y-8 p-2">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <Avatar className="w-32 h-32 relative border-4 border-white shadow-xl">
                <AvatarImage src={profile.avatar_url} alt="Profile" className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-2xl font-bold">
                  {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full p-3 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              >
                <Camera className="w-5 h-5" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            {uploading && (
              <div className="flex items-center space-x-2 text-purple-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <p className="text-sm font-medium">Uploading your photo...</p>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-pink-500" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full-name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="full-name"
                  value={profile.full_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="border-2 border-gray-200 focus:border-pink-400 rounded-lg h-12 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  className="border-2 border-gray-200 focus:border-pink-400 rounded-lg h-12 transition-colors"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter your location"
                  className="border-2 border-gray-200 focus:border-pink-400 rounded-lg h-12 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Password Update */}
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-500" />
              Security Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (optional)"
                    className="border-2 border-gray-200 focus:border-purple-400 rounded-lg h-12 pr-12 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="border-2 border-gray-200 focus:border-purple-400 rounded-lg h-12 transition-colors"
                />
              </div>
            </div>
            
            {newPassword && confirmPassword && (
              <div className="flex items-center space-x-2 text-sm">
                {newPassword === confirmPassword ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Passwords match
                  </div>
                ) : (
                  <div className="text-red-500">
                    Passwords do not match
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              onClick={handleSave} 
              disabled={loading} 
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
