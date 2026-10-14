"use client";
import useAddPatient from "./hooks/useAddPatient";

export function AddPatient() {
  const {
    register,
    patientRegisterFormHandler,
    handleSubmit,
    errors,
    isSubmitting,
  } = useAddPatient();
  return (
    <form onSubmit={handleSubmit(patientRegisterFormHandler)} noValidate>
      <table>
        <tbody>
          <tr>
            <td>First Name</td>
            <td>
              <input
                type="text"
                className="border rounded-sm ml-5 my-2"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm ml-5">
                  {errors.firstName.message}
                </p>
              )}
            </td>
          </tr>
          <tr>
            <td>Last Name</td>
            <td>
              <input
                type="text"
                className="border rounded-sm ml-5 my-2"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm ml-5">
                  {errors.lastName.message}
                </p>
              )}
            </td>
          </tr>
          <tr>
            <td>Email Address</td>
            <td>
              <input
                type="text"
                className="border rounded-sm ml-5 my-2"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-600 text-sm ml-5">
                  {errors.email.message}
                </p>
              )}
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <input
                type="submit"
                value="Submit"
                disabled={isSubmitting}
                className="border rounded-sm border-blue-300 bg-blue-200 px-5 py-0 m-5"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
