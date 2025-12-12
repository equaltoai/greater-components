import { describe, it, expect, vi } from 'vitest';
import { render, waitFor, act } from '@testing-library/svelte';
import ContextLogicHarness from './harness/ContextLogicHarness.svelte';
import type { ChatContextValue, ChatHandlers } from '../src/context.svelte.js';

describe('Chat Context Logic', () => {
    async function setup(handlers: ChatHandlers = {}) {
        let context: ChatContextValue | undefined;
        
        const captureContext = (ctx: ChatContextValue) => {
            context = ctx;
        };

        const result = render(ContextLogicHarness, {
            props: {
                handlers,
                onContext: captureContext
            }
        });

        await waitFor(() => expect(context).toBeDefined());
        
        return { context: context!, ...result };
    }

    describe('sendMessage', () => {
        it('adds user message and calls onSubmit', async () => {
            const onSubmit = vi.fn();
            const { context } = await setup({ onSubmit });

            await context.sendMessage('Hello world');

            expect(context.state.messages).toHaveLength(1);
            expect(context.state.messages[0].role).toBe('user');
            expect(context.state.messages[0].content).toBe('Hello world');
            expect(context.state.loading).toBe(false); // Should be false after await
            expect(onSubmit).toHaveBeenCalledWith('Hello world');
        });

        it('handles submission errors', async () => {
            const onSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
            const { context } = await setup({ onSubmit });

            // We need to add an assistant message that would be marked as error, 
            // but sendMessage logic only marks the *last assistant message* as error if it exists.
            // If we just send a message, there is no assistant message yet.
            // The logic in context.ts:
            // state.error = error.message
            // if (lastMessage && lastMessage.role === 'assistant') ...
            
            await context.sendMessage('Hello fail');

            expect(context.state.error).toBe('Network error');
            expect(context.state.loading).toBe(false);
        });

        it('does not send empty content', async () => {
            const onSubmit = vi.fn();
            const { context } = await setup({ onSubmit });

            await context.sendMessage('   ');

            expect(onSubmit).not.toHaveBeenCalled();
            expect(context.state.messages).toHaveLength(0);
        });
    });

    describe('retryLastMessage', () => {
        it('retries the last user message', async () => {
            const onRetry = vi.fn();
            const { context } = await setup({ onRetry });

            // Setup messages: User -> Assistant (Error)
            act(() => {
                context.addMessage({ role: 'user', content: 'User msg 1', status: 'complete' });
                context.addMessage({ role: 'assistant', content: 'Assist 1', status: 'complete' });
                context.addMessage({ role: 'user', content: 'User msg 2', status: 'complete' });
                context.addMessage({ role: 'assistant', content: 'Error msg', status: 'error' });
            });

            expect(context.state.messages).toHaveLength(4);

            await context.retryLastMessage();

            // Should remove messages after the last user message (which is index 2)
            // So messages 0, 1, 2 remain. 3 is removed.
            // Wait, logic says: state.messages = state.messages.slice(0, actualIndex + 1);
            // actualIndex is the index of last user message.
            
            expect(context.state.messages).toHaveLength(3);
            expect(context.state.messages[2].content).toBe('User msg 2');
            expect(onRetry).toHaveBeenCalled();
        });

        it('does nothing if no user message found', async () => {
            const onRetry = vi.fn();
            const { context } = await setup({ onRetry });
            
            // Empty messages
            await context.retryLastMessage();
            
            expect(onRetry).not.toHaveBeenCalled();
        });
    });

    describe('Tool Calls', () => {
        it('adds and updates tool calls', async () => {
            const { context } = await setup();

            let msgId: string = '';
            act(() => {
                const msg = context.addMessage({ role: 'assistant', content: 'Thinking...', status: 'streaming' });
                msgId = msg.id;
            });

            let toolCallId: string = '';
            act(() => {
                const toolCall = context.addToolCall(msgId, {
                    name: 'calculator',
                    args: { expression: '2+2' },
                    status: 'pending'
                });
                toolCallId = toolCall.id;
            });

            const msg = context.state.messages.find(m => m.id === msgId);
            expect(msg?.toolCalls).toHaveLength(1);
            expect(msg?.toolCalls?.[0].name).toBe('calculator');

            act(() => {
                context.updateToolCall(msgId, toolCallId, {
                    result: '4',
                    status: 'complete'
                });
            });

            const updatedMsg = context.state.messages.find(m => m.id === msgId);
            expect(updatedMsg?.toolCalls?.[0].status).toBe('complete');
            expect(updatedMsg?.toolCalls?.[0].result).toBe('4');
        });
    });

    describe('Streaming', () => {
        it('updates stream content and cancels', async () => {
            const onStopStreaming = vi.fn();
            const { context } = await setup({ onStopStreaming });

            let msgId: string = '';
            act(() => {
                const msg = context.addMessage({ role: 'assistant', content: '', status: 'streaming' });
                msgId = msg.id;
                context.updateState({ streaming: true });
            });

            act(() => {
                context.updateStreamContent('Hello');
            });

            expect(context.state.streamContent).toBe('Hello');
            expect(context.state.messages.find(m => m.id === msgId)?.content).toBe('Hello');

            act(() => {
                context.cancelStream();
            });

            expect(context.state.streaming).toBe(false);
            expect(context.state.messages.find(m => m.id === msgId)?.status).toBe('complete');
            expect(onStopStreaming).toHaveBeenCalled();
        });
    });
    
    describe('Settings', () => {
        it('toggles settings panel', async () => {
             const { context } = await setup();
             
             expect(context.state.settingsOpen).toBe(false);
             
             act(() => {
                 context.toggleSettings();
             });
             
             expect(context.state.settingsOpen).toBe(true);
        });
    });
});