
import {Header} from "@/components/header"

function DashboardLayout({children} : {children:React.ReactNode}){
    return(
        <div className="min-h-screen">
            <Header/>
            <main className="pt-4 xl:pt-10">{children}</main>
        </div>
    ); 
}

export default DashboardLayout ;