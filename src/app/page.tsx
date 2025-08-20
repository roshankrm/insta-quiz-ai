import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SignInButton from "@/components/SignInButton";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();
  if(session?.user) {
    return redirect("/dashboard");
  }
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className="min-w-[300px] w-[40vw]">
        <CardHeader>
          <CardTitle>Welcome to InstaQuizAI!</CardTitle>
          <CardDescription>
            InstaQuiz AI is a quiz app that helps you generate instant quizzes on topics of your choice.
            You can also share it with your friends and family to test their knowledge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text="Sign in to get Started!" />
        </CardContent>
      </Card>
    </div>
  );
}
