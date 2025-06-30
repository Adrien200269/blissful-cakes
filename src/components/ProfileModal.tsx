
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Camera, Eye, EyeOff, User, Phone, MapPin, Lock, CheckCircle, Star, Heart, Sparkles } from 'lucide-react';

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
      title: '✨ Photo Updated!',
      description: 'Your profile photo looks amazing!',
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
        title: '🎉 Success!',
        description: 'Your profile has been updated beautifully!',
      });
    }

    setLoading(false);
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Oops!',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Security Alert',
        description: 'Password must be at least 6 characters for your protection',
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
        title: '🔐 Password Updated!',
        description: 'Your account is now more secure!',
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
      <DialogContent className="sm:max-w-3xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50 border-0 shadow-2xl rounded-3xl font-inter">
        {/* Decorative Elements */}
        <div className="absolute top-4 right-6 text-pink-300">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div className="absolute top-8 right-12 text-violet-300">
          <Heart className="w-4 h-4 animate-bounce" />
        </div>
        <div className="absolute top-6 left-6 text-rose-300">
          <Star className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        <DialogHeader className="text-center pb-4 pt-8">
          <DialogTitle className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-violet-600 bg-clip-text text-transparent font-playfair">
            Your Beautiful Profile
          </DialogTitle>
          <p className="text-gray-600 mt-3 text-lg font-light">Customize your personal space with style ✨</p>
        </DialogHeader>
        
        <div className="space-y-10 p-4">
          {/* Enhanced Avatar Section */}
          <div className="flex flex-col items-center space-y-8">
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-r from-pink-400 via-rose-400 to-violet-400 rounded-full opacity-20 group-hover:opacity-40 transition-all duration-500 blur-xl"></div>
              <div className="absolute -inset-3 bg-gradient-to-r from-pink-300 to-violet-300 rounded-full opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
              <Avatar className="w-40 h-40 relative border-4 border-white shadow-2xl ring-4 ring-pink-100 group-hover:ring-pink-200 transition-all duration-300">
                <AvatarImage src={profile.avatar_url} alt="Profile" className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-pink-400 via-rose-400 to-violet-500 text-white text-3xl font-bold">
                  {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '✨'}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white rounded-full p-4 cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-110 hover:rotate-3"
              >
                <Camera className="w-6 h-6" />
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
              <div className="flex items-center space-x-3 text-violet-600 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-600"></div>
                <p className="text-sm font-medium">Creating magic... ✨</p>
              </div>
            )}
          </div>

          {/* Enhanced Profile Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 font-playfair">Personal Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="full-name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-500" />
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="full-name"
                    value={profile.full_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter your beautiful name"
                    className="border-2 border-pink-200 focus:border-pink-400 rounded-2xl h-14 pl-4 transition-all duration-300 bg-white/90 backdrop-blur-sm font-medium text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-rose-500" />
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Your contact number"
                    className="border-2 border-rose-200 focus:border-rose-400 rounded-2xl h-14 pl-4 transition-all duration-300 bg-white/90 backdrop-blur-sm font-medium text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-violet-500" />
                  Location
                </Label>
                <div className="relative">
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Where are you located?"
                    className="border-2 border-violet-200 focus:border-violet-400 rounded-2xl h-14 pl-4 transition-all duration-300 bg-white/90 backdrop-blur-sm font-medium text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Security Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 font-playfair">Security & Privacy</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="new-password" className="text-sm font-semibold text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="border-2 border-purple-200 focus:border-purple-400 rounded-2xl h-14 pr-14 pl-4 transition-all duration-300 bg-white/90 backdrop-blur-sm font-medium text-gray-700 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="border-2 border-purple-200 focus:border-purple-400 rounded-2xl h-14 pl-4 transition-all duration-300 bg-white/90 backdrop-blur-sm font-medium text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
            
            {newPassword && confirmPassword && (
              <div className="flex items-center justify-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                {newPassword === confirmPassword ? (
                  <div className="flex items-center text-green-600 font-medium">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Perfect! Passwords match ✨
                  </div>
                ) : (
                  <div className="text-rose-500 font-medium">
                    Passwords don't match yet 🤔
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 pt-8">
            <Button 
              onClick={handleSave} 
              disabled={loading} 
              className="flex-1 bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500 hover:from-pink-600 hover:via-rose-600 hover:to-violet-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving your magic...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6" />
                  <span>Save My Beautiful Profile</span>
                </div>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-lg bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
