export default PaymentDefault = () => {
    const [isloading,setIsloading]=useState<boolean>(true);
    const [Error,setError]=useState<string|null>(null);


    if(isloading){
        return(<h1>Loading</h1>)};
    if(Error)
    return(<h1>PaymentFailed</h1>)
}