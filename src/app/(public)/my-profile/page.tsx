import ProfileData from '@/components/profile/ProfileData'
import { cookies } from 'next/headers';
import React from 'react'

const Page = async () => {

  return (
    <div className='mt-5 outfit-font'>
      <ProfileData />
    </div>
  );
};

export default Page;
