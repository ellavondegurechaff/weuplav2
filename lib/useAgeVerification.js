import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAgeVerification = create(
  persist(
    (set) => ({
      isVerified: false,
      setVerified: (status) => set({ isVerified: status }),
    }),
    {
      name: 'age-verification',
    }
  )
)

export default useAgeVerification 