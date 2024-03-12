import EnableMFA from "../../enableMFA";

export default function Page() {
  return (
    <div className="pt-12 pl-12">
      {/* <div className = 'text-center'> Accounts & Security Sub Page</div> */}

      <div className="justify-center">Multifactor Authentication: </div>

      <EnableMFA />
    </div>
  );
}
