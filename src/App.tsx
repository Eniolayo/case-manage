import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { QueryProvider } from "@/components/query-provider";
import { SidebarProvider } from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import LoginPage from "@/pages/login";
import HomePage from "@/pages/home";
import AllCasesPage from "@/pages/cases";
import CaseDetailPage from "@/pages/cases/[id]";
import LinkedCasesPage from "@/pages/cases/[id]/linked";
import NewCasePage from "@/pages/cases/new";
import MyCasesPage from "@/pages/my-cases";
import HighRiskPage from "@/pages/high-risk";

function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SidebarProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />{" "}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="cases" element={<AllCasesPage />} />
                  <Route path="cases/:id" element={<CaseDetailPage />} />
                  <Route
                    path="cases/:id/linked"
                    element={<LinkedCasesPage />}
                  />
                  <Route path="cases/new" element={<NewCasePage />} />
                  <Route path="my-cases" element={<MyCasesPage />} />
                  <Route path="high-risk" element={<HighRiskPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;
