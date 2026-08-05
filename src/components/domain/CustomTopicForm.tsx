import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { customTopicSchema, type CustomTopicInput } from "@/lib/validation";

interface CustomTopicFormProps {
  placeholder: string;
  isSubmitting: boolean;
  onSubmit: (prompt: string) => void;
}

export function CustomTopicForm({ placeholder, isSubmitting, onSubmit }: CustomTopicFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomTopicInput>({ resolver: zodResolver(customTopicSchema) });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values.prompt))}
      className="space-y-3"
      noValidate
    >
      <div>
        <Textarea
          placeholder={placeholder}
          disabled={isSubmitting}
          aria-invalid={!!errors.prompt}
          aria-describedby={errors.prompt ? "custom-topic-error" : undefined}
          {...register("prompt")}
        />
        {errors.prompt && (
          <p id="custom-topic-error" role="alert" className="mt-1.5 text-xs font-medium text-danger">
            {errors.prompt.message}
          </p>
        )}
      </div>
      <Button type="submit" variant="secondary" className="w-full" disabled={isSubmitting}>
        <Sparkles className="h-4 w-4" />
        {isSubmitting ? "Menyiapkan..." : "Buat Latihan dari Topik Ini"}
      </Button>
    </form>
  );
}
