import moment from 'moment-timezone';
import classnames from 'classnames';
import { ExternalLinkIcon } from '@heroicons/react/outline';

import useCountdown from '@root/ui/hooks/useCountdown';

interface Props {
  featured: boolean;
  releaseDate: Date;
  name: string;
  image: string;
  description: string;
  price: string;
  supply: number;
  website: string | null;
  discord: string | null;
  twitterUsername: string | null;
}

const Countdown: React.FC<Props> = ({
  featured,
  name,
  image,
  description,
  price,
  supply,
  website,
  discord,
  twitterUsername,
  releaseDate,
}) => {
  const timeLeft = useCountdown(moment.utc(releaseDate).diff(moment.utc()));

  return (
    <div
      className={classnames('relative bg-dark-800 p-4 rounded hover:shadow-xl', {
        'overflow-hidden border border-green-950': featured,
      })}
    >
      {featured && (
        <div className="ribbon bg-green-950 text-base font-bold whitespace-no-wrap px-10 py-1">
          Featured
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-row items-center space-x-4">
          <div>
            <img src={image} className="h-20 w-20 rounded" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="text-2xl font-bold">{name}</div>
          </div>
        </div>
        <div>
          <div className="text-sm line-clamp-2">{description}</div>
        </div>
        <div className="flex flex-row items-center space-x-4">
          {website ? (
            <div className="flex flex-row items-center text-sm text-gray-300 underline cursor-pointer capitalize">
              <ExternalLinkIcon className="h-5 w-5 mr-1" />
              Website
            </div>
          ) : null}
          {twitterUsername ? (
            <div className="flex flex-row items-center text-sm text-gray-300 underline cursor-pointer capitalize">
              <svg
                className="h-4 w-4 fill-current text-gray-300 mr-1"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Twitter</title>
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Twitter
            </div>
          ) : null}
          {discord ? (
            <div className="flex flex-row items-center text-sm text-gray-300 underline cursor-pointer capitalize">
              <svg
                className="h-4 w-4 fill-current text-gray-300 mr-2"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Discord</title>
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
              Discord
            </div>
          ) : null}
        </div>
        <div className="border-b border-divider-900" />
        <div className="space-y-2">
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm">Price:</div>
            <div className="text-sm">{price}</div>
          </div>
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm">Total Supply:</div>
            <div className="text-sm">{supply.toLocaleString()}</div>
          </div>
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm">Release Date:</div>
            <div className="text-sm">{moment.utc(releaseDate).format('MMM DD, YYYY HH:mm:ss')}</div>
          </div>
        </div>
        <div className="border-b border-divider-900" />
        <div className="flex flex-col h-11">
          {timeLeft ? (
            <>
              <div className="flex flex-row items-center justify-center">
                <div className="flex flex-1 justify-center font-medium">
                  {String(timeLeft.days()).padStart(2, '0')}
                </div>
                <div className="flex flex-1 justify-center font-medium">
                  {String(timeLeft.hours()).padStart(2, '0')}
                </div>
                <div className="flex flex-1 justify-center font-medium">
                  {String(timeLeft.minutes()).padStart(2, '0')}
                </div>
                <div className="flex flex-1 justify-center font-medium">
                  {String(timeLeft.seconds()).padStart(2, '0')}
                </div>
              </div>
              <div className="flex flex-row items-center justify-center">
                <div className="flex flex-1 justify-center text-sm font-thin">Day</div>
                <div className="flex flex-1 justify-center text-sm font-thin">Hrs</div>
                <div className="flex flex-1 justify-center text-sm font-thin">Min</div>
                <div className="flex flex-1 justify-center text-sm font-thin">Sec</div>
              </div>
            </>
          ) : (
            <div className="text-lg text-center font-bold bg-dark-900 rounded py-2 text-green-940">
              Live!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Countdown;
