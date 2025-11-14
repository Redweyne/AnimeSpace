import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './Layout'
import Feed from './pages/Feed'
import CreateMoment from './pages/CreateMoment'
import MomentDetail from './pages/MomentDetail'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Feed /></Layout>} />
          <Route path="/create" element={<Layout><CreateMoment /></Layout>} />
          <Route path="/moment" element={<Layout><MomentDetail /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
