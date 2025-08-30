import { cookies } from 'next/headers';

export default async function Home() {
  const userResponse = await fetch(`${process.env.API_URL}/users`, {
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });

  console.log((await cookies()).toString());
  const users = await userResponse.json();

  console.log('[users]', users);

  return (
    <div className='h-screen flex items-center justify-center flex-col gap-5 overflow-hidden'>
      <h1>Users</h1>
      <ul>
        {users?.map((user: any) => (
          <li key={user._id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}
