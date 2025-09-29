"use client";

import { useMutation } from 'convex/react';
import { useState } from 'react';


const useMutationState = (mutationtoRun: any) => {
  const [pending, setPending] = useState(false)
  const mutationFn = useMutation(
    mutationtoRun
  )

  const mutate = async (data: any) => {
    try {
      setPending(true)
      return await mutationFn(data)
    } catch (error) {
      throw error
    } finally {
      setPending(false)
    }
  }

  return {
    pending,
    mutate,
  }
}

export default useMutationState