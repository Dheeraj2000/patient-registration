
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { registerPatient } from "@/lib/patient-registration";

interface PatientFormValues {
  first_name: string;
  last_name: string;
  date_of_birth: number;
  gender: string;
  email: string;
  phone: string;
  address: string;
}

export function PatientRegistrationForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PatientFormValues>();

  const onSubmit = async (data: PatientFormValues) => {
    try {
      await registerPatient(data);
      toast({
        title: "Patient Registered",
        description: `Successfully registered ${data.first_name} ${data.last_name}`,
      });
      reset();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Could not register patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="first_name" className="text-sm font-medium">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            {...register("first_name", { required: "First name is required" })}
            className="w-full p-2 border rounded-md"
          />
          {errors.first_name && (
            <p className="text-sm text-red-500">{errors.first_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="last_name" className="text-sm font-medium">
            Last Name
          </label>
          <input
            id="last_name"
            type="text"
            {...register("last_name", { required: "Last name is required" })}
            className="w-full p-2 border rounded-md"
          />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="date_of_birth" className="text-sm font-medium">
            Date of Birth
          </label>
          <input
            id="date_of_birth"
            type="date"
            {...register("date_of_birth", { required: "Date of birth is required" })}
            className="w-full p-2 border rounded-md"
          />
          {errors.date_of_birth && (
            <p className="text-sm text-red-500">{errors.date_of_birth.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="gender" className="text-sm font-medium">
            Gender
          </label>
          <select
            id="gender"
            {...register("gender", { required: "Gender is required" })}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-sm text-red-500">{errors.gender.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full p-2 border rounded-md"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className="w-full p-2 border rounded-md"
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <textarea
            id="address"
            {...register("address")}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Register Patient
      </button>
    </form>
  );
}
