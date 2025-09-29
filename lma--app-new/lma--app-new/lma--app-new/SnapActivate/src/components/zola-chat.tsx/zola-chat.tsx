"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sparkles, Bot, X, Send, Loader2, CheckCircle, Clock, BarChart, Download, AlertTriangle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { zolaChat, ZolaChatOutput } from '@/ai/flows/zola-chat-flow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { useAuth } from '@/contexts/auth-context';

type Message = {
    id: string;
    text?: string;
    role: 'user' | 'model';
    buttons?: string[];
    liveDashboardData?: ZolaChatOutput['campaignLiveStatus'];
    performanceSummary?: ZolaChatOutput['performanceSummary'];
};

const initialMessage: Message = {
    id: 'initial',
    role: 'model',
    text: "Hi there! I'm Zola, your AI assistant. How can I help you streamline your campaign management today?",
    buttons: ['Live Campaigns', 'Setup a Campaign', 'Performance Summary']
};

export function ZolaChat() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([initialMessage]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isThinking || !user) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            text: text,
            role: 'user'
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsThinking(true);

        try {
            const chatHistory = newMessages
                .filter(msg => msg.text) 
                .map(msg => ({ role: msg.role, content: msg.text! }));

            const zolaResponse = await zolaChat({ history: chatHistory, brandId: user.uid });

            const zolaMessage: Message = {
                id: `zola-${Date.now()}`,
                role: 'model',
                text: zolaResponse.text,
                liveDashboardData: zolaResponse.campaignLiveStatus,
                performanceSummary: zolaResponse.performanceSummary,
                buttons: zolaResponse.buttons,
            };
            setMessages(prev => [...prev, zolaMessage]);
        } catch (error) {
             const errorMessage: Message = {
                id: `zola-error-${Date.now()}`,
                role: 'model',
                text: "Sorry, I encountered an error. Please try again.",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleButtonClick = (buttonText: string) => {
        handleSendMessage(buttonText);
    };

    return (
        <>
            <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out", 
                isOpen ? 'scale-0' : 'scale-100'
            )}>
                <Button
                    size="icon"
                    className="rounded-full w-16 h-16 bg-primary/90 hover:bg-primary shadow-lg"
                    onClick={() => setIsOpen(true)}
                >
                    <Sparkles className="w-8 h-8" />
                </Button>
            </div>

            <div className={cn("fixed bottom-6 right-6 z-50 w-full max-w-sm transition-transform duration-300 ease-in-out",
                 isOpen ? 'transform-none' : 'transform translate-y-[calc(100%+2rem)]'
            )}>
                <Card className="flex flex-col h-[70vh] bg-card/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>
                                    <Bot />
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-lg">Zola</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent ref={chatContentRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {messages.map((message) => (
                            <div key={message.id} className={cn("flex flex-col gap-2", 
                                message.role === 'user' ? 'items-end' : 'items-start'
                            )}>
                                {message.text && (
                                    <div className={cn("max-w-xs rounded-lg px-4 py-2 text-sm", 
                                        message.role === 'user' 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-muted text-muted-foreground'
                                    )}>
                                        {message.text}
                                    </div>
                                )}
                                
                                {message.liveDashboardData && message.liveDashboardData.campaigns.length > 0 && (
                                     <div className="w-full bg-background rounded-lg p-3">
                                        <p className="text-sm font-semibold mb-2 text-foreground">Here's your live campaign dashboard:</p>
                                        {message.liveDashboardData.campaigns.map((campaign, index) => (
                                            <Card key={index} className="mb-3">
                                                <CardHeader className="p-3">
                                                    <CardTitle className="text-base">{campaign.campaignTitle}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-3 pt-0">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="h-8">Promoter</TableHead>
                                                                <TableHead className="h-8">Status</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {campaign.promoters.map((promoter, pIndex) => (
                                                                <TableRow key={pIndex}>
                                                                    <TableCell className="py-1">{promoter.name}</TableCell>
                                                                    <TableCell className="py-1">
                                                                        <Badge variant={promoter.status === 'Checked-In' ? 'default' : 'secondary'}
                                                                            className={promoter.status === 'Checked-In' ? 'bg-green-500/20 text-green-700' : ''}>
                                                                            {promoter.status === 'Checked-In' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                                                            {promoter.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </CardContent>
                                                <CardFooter className="p-3 flex-wrap gap-2">
                                                    {campaign.suggestedActions?.map((action, aIndex) => (
                                                        <Button key={aIndex} size="sm" variant="outline" className="text-xs h-7" onClick={() => handleButtonClick(`${action} for ${campaign.campaignTitle}`)}>{action}</Button>
                                                    ))}
                                                </CardFooter>
                                            </Card>
                                        ))}
                                         <p className="text-xs text-center text-muted-foreground mt-2">You can ask me to refresh this view anytime.</p>
                                     </div>
                                )}

                                {message.performanceSummary && (
                                    <div className="w-full bg-background rounded-lg p-3">
                                        <Card className="border-primary">
                                            <CardHeader className="p-3 bg-muted/50">
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <BarChart className="w-5 h-5" />
                                                    Performance Summary
                                                </CardTitle>
                                                <CardDescription>{message.performanceSummary.campaignName}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-2 text-sm space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Attendance Rate</span>
                                                    <span className="font-semibold">{message.performanceSummary.summary.attendanceRate}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Total Sales</span>
                                                    <span className="font-semibold">{message.performanceSummary.summary.totalSales}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Engagements</span>
                                                    <span className="font-semibold">{message.performanceSummary.summary.customerEngagements}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Feedback Highlights</span>
                                                    <p className="font-semibold text-xs italic mt-1">"{message.performanceSummary.summary.feedbackHighlights}"</p>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="p-2 border-t flex-wrap gap-2">
                                                {message.performanceSummary.actionButtons?.map((action, aIndex) => (
                                                    <Button key={aIndex} size="sm" variant="outline" className="text-xs h-7" onClick={() => handleButtonClick(`${action} for ${message.performanceSummary?.campaignName}`)}>
                                                        {action === 'Download Report' && <Download className="w-3 h-3 mr-1" />}
                                                        {action === 'Flag Issue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                                        {action === 'Rate Promoter' && <Star className="w-3 h-3 mr-1" />}
                                                        {action}
                                                    </Button>
                                                ))}
                                            </CardFooter>
                                        </Card>
                                    </div>
                                )}

                                {message.buttons && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {message.buttons.map((btn, index) => (
                                            <Button 
                                                key={index}
                                                size="sm"
                                                variant="outline"
                                                className="bg-background/50"
                                                onClick={() => handleButtonClick(btn)}
                                                disabled={isThinking}
                                            >
                                                {btn}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                         {isThinking && (
                            <div className="flex items-start gap-2">
                                <div className="max-w-xs rounded-lg px-4 py-2 text-sm bg-muted text-muted-foreground flex items-center gap-2">
                                   <Loader2 className="w-4 h-4 animate-spin" />
                                   <span>Zola is thinking...</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="p-2 border-t">
                        <form
                            className="flex w-full items-center space-x-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage(inputValue);
                            }}
                        >
                            <Input
                                id="message"
                                placeholder="Ask about campaigns, performance..."
                                className="flex-1"
                                autoComplete="off"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={isThinking}
                            />
                            <Button type="submit" size="icon" disabled={!inputValue.trim() || isThinking}>
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}