import DetailsSupplier from "@/app/components/DetailsSupplier"
import DetailsSupplierPay from "@/app/components/DetailsSupplierPay"

const Page = () => {

    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">
            <div className="flex w-full items-center justify-center">
                <div role="tablist" className="tabs tabs-bordered p-3">
                    <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="PRODUCT DETAILS" defaultChecked />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                        <DetailsSupplier />
                    </div>
                    <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="PAYMENT DETAILS" />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                        <DetailsSupplierPay />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Page