import type { ApolloError } from '@apollo/client';
import Skeleton from 'react-loading-skeleton';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  collections: {
    name: string;
    image_url: string;
    seven_day_volume: number;
    seven_day_sales: number;
    total_volume: number;
    total_sales: number;
    total_supply: number;
    num_owners: number;
  }[];
}

const AllCollections: React.FC<Props> = ({ loading, collections }) => {
  return (
    <>
      <div className="mb-6">
        <span className="text-2xl font-bold mb-1 border-b border-green-950 pb-1">All Collections</span>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-divider-900 rounded">
              <table className="min-w-full divide-y divide-divider-900">
                <thead className="bg-dark-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Volume (All Time)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Sales (All Time)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Volume (7d)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Sales (7d)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Supply
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Owners
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-dark-800 divide-y divide-divider-900">
                  {loading &&
                    Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton duration={2} count={1} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton duration={2} count={1} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton duration={2} count={1} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton duration={2} count={1} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton duration={2} count={1} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton duration={2} count={1} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton duration={2} count={1} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton duration={2} count={1} />
                        </td>
                      </tr>
                    ))}

                  {!loading &&
                    collections &&
                    collections.map((collection, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>{i + 1}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={collection.image_url} alt={collection.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-green-950 font-bold text-lg hover:underline cursor-pointer">{collection.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium tracking-wider">
                            {collection.total_volume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETH
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap tracking-wider">
                          <div className="text-sm font-medium">{collection.total_sales.toLocaleString()} ETH</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap tracking-wider">
                          <div className="text-sm font-medium">{collection.seven_day_volume.toLocaleString()} ETH</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap tracking-wider">
                          <div className="text-sm font-medium">{collection.seven_day_sales.toLocaleString()} ETH</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap tracking-wider">
                          <div className="text-sm font-medium">{collection.total_supply.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap tracking-wider">
                          <div className="text-sm font-medium">{collection.num_owners.toLocaleString()}</div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCollections;
