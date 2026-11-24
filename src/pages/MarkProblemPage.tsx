import { useIsDesktop } from '@/lib/useMediaQuery'
import { DesktopMarkForm } from '@/features/mark-problem/DesktopMarkForm'
import { MobileMarkFlow } from '@/features/mark-problem/MobileMarkFlow'
import { useMarkProblemForm } from '@/features/mark-problem/useMarkProblemForm'

export default function MarkProblemPage() {
  const form = useMarkProblemForm()
  const isDesktop = useIsDesktop()

  return isDesktop ? <DesktopMarkForm form={form} /> : <MobileMarkFlow form={form} />
}
