import DistEdit from "@/app/components/DistEdit"
import ProfitSetup from "@/app/components/ProfitSetup"
import ShopInfo from "@/app/components/ShopInfo"

const Page = () => {
  return (
    <div className='container min-h-screen'>
      <div className="flex w-full items-center justify-center">
        <div role="tablist" className="tabs tabs-bordered p-3">
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="PROFIT SETUP" defaultChecked />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <ProfitSetup />
          </div>
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="ADDRESS SETUP" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <ShopInfo />
          </div>
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="DISTRIBUTION EDIT" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <DistEdit />
          </div>
         
        </div>
      </div>
    </div>
  )
}

export default Page