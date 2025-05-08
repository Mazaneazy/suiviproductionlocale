
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useIsMobile } from '@/hooks/use-mobile';

const resetSchema = z.object({
  email: z.string()
    .email('Adresse email invalide')
    .min(1, 'L\'email est requis'),
});

type ResetFormValues = z.infer<typeof resetSchema>;

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (values: ResetFormValues) => {
    setIsLoading(true);
    
    try {
      const success = await resetPassword(values.email);
      
      if (success) {
        toast({
          title: "Email envoyé",
          description: "Si un compte existe avec cet email, les instructions de réinitialisation ont été envoyées.",
        });
        form.reset();
        onOpenChange(false);
      } else {
        // On ne révèle pas si l'email existe ou non pour des raisons de sécurité
        toast({
          title: "Email envoyé",
          description: "Si un compte existe avec cet email, les instructions de réinitialisation ont été envoyées.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'w-[95%]' : 'sm:max-w-md'} mx-auto`}>
        <DialogHeader>
          <DialogTitle>Réinitialisation du mot de passe</DialogTitle>
          <DialogDescription>
            Entrez votre adresse email pour recevoir les instructions de réinitialisation de mot de passe.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input 
                        placeholder="Adresse email"
                        className="pl-10" 
                        type="email"
                        inputMode="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter className={`pt-4 ${isMobile ? 'flex-col space-y-2' : ''}`}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className={isMobile ? 'w-full' : ''}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className={`bg-certif-blue hover:bg-certif-blue/90 ${isMobile ? 'w-full' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer les instructions'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
