

const YellowCoverSvg = ({ expanded }) => {
  const d = expanded ?
      'path("M106,500 C40,500 40,500 -60,500 V0 H560 V500 C500,500 440,500 360,500 C224,500 196,500 106,500Z")' :
      'path("M106 242 C40,249.66 40,380 -60,340 V0 H560 V240 C500,315 440,337 360,334 C224,329 196,231 106,242Z")';

  return (
      <div className="inline-block relative w-full h-full align-middle overflow-hidden"
           style={{ paddingBottom: '100%' }}
      >
        <div
            className="w-full bg-yellow"
            style={{
              transitionDuration: '1.4s',
              height: expanded ? 'calc((100vh - 100vw)' : 0
            }}
        ></div>
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path style={{ transitionDuration: '1.4s', d }}
                fill="#e1e100"
          />
        </svg>
      </div>
  )
}

export default YellowCoverSvg;