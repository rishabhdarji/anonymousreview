import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, code: user.verifyCode },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching verification code:', error);
        return Response.json(
            { success: false, message: 'Error fetching verification code' },
            { status: 500 }
        );
    }
}
