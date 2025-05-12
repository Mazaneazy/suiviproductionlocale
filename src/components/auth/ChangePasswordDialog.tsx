import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, EyeOff, Eye } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const passwordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Mot de passe actuel requis'),
  newPassword: z.string()
    .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string()
    .min(1, 'Confirmation du mot de passe requise'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface ChangePasswordDialogProps {
  trigger: React.ReactNode;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ trigger }) => {
  const { currentUser, changePassword } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (values: PasswordFormValues) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      const success = await changePassword(
        currentUser.id,
        values.currentPassword,
        values.newPassword
      );
      
      if (success) {
        toast({
          title: "Mot de passe modifié",
          description: "Votre mot de passe a été modifié avec succès.",
        });
        form.reset();
        setIsOpen(false);
      } else {
        toast({
          title: "Erreur",
          description: "Mot de passe actuel incorrect ou problème lors de la modification.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    if (field === 'current') setShowCurrentPassword(!showCurrentPassword);
    else if (field === 'new') setShowNewPassword(!showNewPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Changer votre mot de passe</DialogTitle>
          <DialogDescription>
            Entrez votre mot de passe actuel et votre nouveau mot de passe.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe actuel</FormLabel>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input 
                        type={showCurrentPassword ? "text" : "password"}
                        className="pl-10 pr-10" 
                        {...field} 
                      />
                    </FormControl>
                    <button 
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input 
                        type={showNewPassword ? "text" : "password"}
                        className="pl-10 pr-10" 
                        {...field} 
                      />
                    </FormControl>
                    <button 
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        className="pl-10 pr-10" 
                        {...field} 
                      />
                    </FormControl>
                    <button 
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-certif-blue hover:bg-certif-blue/90"
                disabled={isLoading}
              >
                {isLoading ? 'Modification en cours...' : 'Modifier'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
