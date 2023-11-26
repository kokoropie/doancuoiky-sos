import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const form = useForm({
        name: auth.user.name,
        email: auth.user.email,
        dateOfBirth: auth.user.details.dateOfBirth,
        phone: auth.user.details.phone,
        gender: auth.user.details.gender
    });
    return (
        <Layout>
            <Head title="Profile" />
            <div className="mt-[40px] px-[10%]">
                <h1 className="font-extrabold text-4xl">Welcome, {auth.user.name}</h1>
            </div>
            <div className="mt-10 md:mx-[10%] bg-[#F1F1F1] rounded-lg px-3 py-2">
                <div className="flex space-x-5 text-xl mb-4 overflow-x-auto">
                    <Link href={route("profile.exams.index")} className="hover:border-b-2 border-cyan-500">
                        Exams
                    </Link>
                    <Link href={route("profile.edit")} className="border-b-2 border-cyan-500">
                        Information
                    </Link>
                    <Link href={route('profile.dashboard.index')} className="hover:border-b-2 border-cyan-500">
                        Dashboard
                    </Link>
                </div>
                <hr className="border-black" />
                <div>
                    <form className="grid md:grid-cols-2 gap-5" onSubmit={(e) => {
                        e.preventDefault();
                        form.patch(route('profile.update'));
                    }}>
                        <div>
                            <div>
                                <label>Name</label>
                            </div>
                            <div>
                                <input type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="rounded-lg w-full" />
                                <small className="text-sm text-red-500"></small>
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>Date of birth</label>
                            </div>
                            <div>
                                <input type="date" value={form.data.dateOfBirth} onChange={(e) => form.setData('dateOfBirth', e.target.value)} className="rounded-lg w-full" />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>Email</label>
                            </div>
                            <div>
                                <input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} className="rounded-lg w-full" />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>Phone</label>
                            </div>
                            <div>
                                <input type="tel" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} className="rounded-lg w-full" />
                            </div>
                        </div>
                        <div>
                            <div className='flex items-center'>
                                <span>Gender:</span>
                                <input type="radio" checked={form.data.gender == 0} id="gender-male" onChange={(e) => e.target.checked && form.setData('gender', 0)} className="ml-5 mr-1" /> <label htmlFor="gender-male">Male</label>
                                <input type="radio" checked={form.data.gender == 1} id="gender-female" onChange={(e) => e.target.checked && form.setData('gender', 1)} className="ml-5 mr-1" /> <label htmlFor="gender-female">Female</label>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-cyan-500 text-white text-lg rounded-xl px-5 py-2" type="submit">Save</button>
                            <Link className="bg-red-500 text-white text-lg rounded-xl px-5 py-2" as="button" href={route('logout')} method="post">Logout</Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
    // return (
    //     <AuthenticatedLayout
    //         user={auth.user}
    //         header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
    //     >
    //         <Head title="Profile" />

    //         <div className="py-12">
    //             <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
    //                 <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
    //                     <UpdateProfileInformationForm
    //                         mustVerifyEmail={mustVerifyEmail}
    //                         status={status}
    //                         className="max-w-xl"
    //                     />
    //                 </div>

    //                 <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
    //                     <UpdatePasswordForm className="max-w-xl" />
    //                 </div>

    //                 <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
    //                     <DeleteUserForm className="max-w-xl" />
    //                 </div>
    //             </div>
    //         </div>
    //     </AuthenticatedLayout>
    // );
}
