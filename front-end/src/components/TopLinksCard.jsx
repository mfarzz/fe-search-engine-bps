import React from 'react';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TopLinksCard = ({ topLinks }) => {
    return (
        <Card className="backdrop-blur-xl bg-white/10 rounded-lg shadow-lg border border-white/10 w-96">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <LinkIcon className="w-6 h-6 text-cyan-400" />
                    <CardTitle className="text-lg font-semibold text-white">Top Performing Links</CardTitle>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {topLinks?.map((link, index) => (
                        <div
                            key={link.id_link}
                            className="flex flex-col p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-white truncate">
                                        {link.Link.judul}
                                    </h3>
                                    <a
                                        href={link.Link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 mt-1 group"
                                    >
                                        <span className="truncate">{link.Link.url}</span>
                                        <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                                        {link.click_count} clicks
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!topLinks || topLinks.length === 0) && (
                        <div className="text-center py-8 text-gray-400">
                            No link data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TopLinksCard;