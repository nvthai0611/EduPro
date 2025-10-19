export default function DashboardFooter() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t w-full bg-background px-4 py-3 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
                <p>© {currentYear} Admin Portal. All rights reserved.</p>
                <div className="flex gap-4 mt-2 md:mt-0">
                    <a href="#" className="hover:underline hover:text-foreground">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:underline hover:text-foreground">
                        Terms of Service
                    </a>
                    <a href="#" className="hover:underline hover:text-foreground">
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    )
}
