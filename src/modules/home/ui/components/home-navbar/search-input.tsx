'use client';

import { SearchIcon, XIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';

export const SearchInput = () => {
  return (
    <Suspense fallback={<Skeleton className='h-10 w-full' />}>
      <SearchInputUIOnly />
    </Suspense>
  );
};

const SearchInputUIOnly = () => {
  return (
    <form className='flex w-full max-w-[600px]'>
      <div className='relative w-full'>
        <input
          type='text'
          placeholder='Search'
          className='w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500'
          readOnly
        />
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full'
        >
          <XIcon className='text-gray-500' />
        </Button>
      </div>
      <button
        type='submit'
        className='px-5 py-2.5 bg-gray-100 border border-l-0 rounded-r-full hover:bg-gray-200'
      >
        <SearchIcon className='size-5' />
      </button>
    </form>
  );
};
