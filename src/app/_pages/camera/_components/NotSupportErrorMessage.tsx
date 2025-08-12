import { Button, Card, CardBody } from '@heroui/react'
import React from 'react'
import { LuCamera } from 'react-icons/lu'

export default function CameraErrorMessage({ cameraError, startCamera }: { cameraError: string, startCamera: () => void }) {
    return (
        <Card className="shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardBody className="p-8">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LuCamera className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Camera Access Required
                    </h3>
                    <p className="text-red-500 text-base mb-4">{cameraError}</p>
                </div>
                <Button
                    color="primary"
                    className="bg-black text-white font-semibold hover:bg-gray-800"
                    size="lg"
                    onPress={startCamera}
                >
                    Try Again
                </Button>
            </CardBody>
        </Card>
    )
}
