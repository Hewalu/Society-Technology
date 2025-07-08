'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';

export function NameDialog() {
  const [isOpen, setIsOpen] = useState(true);
  const [nameInput, setNameInput] = useState('');
  const { setName } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleContinue = () => {
    if (nameInput.trim()) {
      setName(nameInput);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Willkommen beim KI-Training</DialogTitle>
          <p className="text-lg max-w-[1000px]">Gib deiner KI einen Namen</p>
          <DialogDescription>
            <Input
              ref={inputRef}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Name"
              className="mt-4"
            />
          </DialogDescription>
        </DialogHeader>
        <Button className='w-fit ml-auto' onClick={handleContinue} disabled={!nameInput.trim()}>
          Mit dem Training beginnen
        </Button>
      </DialogContent>
    </Dialog>
  );
}
