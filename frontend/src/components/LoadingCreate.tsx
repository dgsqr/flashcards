export default function LoadingCreate({
  apiRes,
}: {
  apiRes: {
    msg: string;
    code: number | null;
  };
}) {
  return (
    <div className="w-full h-full fixed top-0 left-0 z-50 flex justify-center items-center">
      {apiRes.msg ? (
        <div className="flex flex-col items-center gap-10">
          <img
            src={`../public/${apiRes.code === 201 ? "check.png" : "warning.png"}`}
            alt="situation"
            className="w-20"
          />
          <p className="font-display font-bold text-2xl">{apiRes.msg}</p>
        </div>
      ) : (
        <div className="hidden flex-col items-center gap-10 animate-pulse">
          <svg
            fill="hsl(228, 97%, 42%)"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-pink w-20"
          >
            <path
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity=".25"
            />
            <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="0.75s"
                values="0 12 12;360 12 12"
                repeatCount="indefinite"
              />
            </path>
          </svg>
          <p className="font-display font-bold text-2xl">
            "Adding card to your deck..."
          </p>
        </div>
      )}
    </div>
  );
}
