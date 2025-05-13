
//import { useToast as useShadcnToast } from "@/components/ui/use-toast";
//import { toast } from "@/components/ui/use-toast";

//export const useToast = useShadcnToast;
//export { toast };
//export default useToast;
// Supprimez les imports circulaires et importez directement depuis la source
import { useToast as useShadcnToast, toast } from "sonner"; // ou depuis la vraie source

export const useToast = useShadcnToast;
export { toast };
export default useToast;